import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {select, Store} from '@ngrx/store';
import {MatPaginator} from '@angular/material/paginator';
import {merge, Observable, Subject, Subscription} from 'rxjs';
import {DataDialog, Publication} from '../../models/publication';
import {GlobalState, selectAuthState} from '../../store/states/global.state';
import {MatDialog} from '@angular/material/dialog';


import {
  selectAllPublication,
  selectPublicationError,
  selectPublicationLoading,
  selectPublicationTotal
} from '../../store/selectors/publication.selectors';
import {PublicationLoadAction} from '../../store/actions/publications.actions';
import {PublicationParams} from '../../models/publication-params';
import {debounceTime, distinctUntilChanged, filter, take, tap} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {PublicationsService} from '../../services/publications-service';
import {User} from '../../models/user';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DialogBoxComponent} from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-valider-table',
  templateUrl: './valider-table.component.html',
  styleUrls: ['./valider-table.component.scss']
})
export class ValiderTableComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['numero_de_lacte', 'objet', 'date_de_lacte', 'acte_nature', 'etat', 'action', 'select'];
  public dataSource: MatTableDataSource<Publication>;
  public publicationTotal: number;
  public noData: Publication[] = [{} as Publication];
  public loading: boolean;
  public error$: Observable<boolean>;
  public filterSubject = new Subject<string>();
  public filterSiren = new Subject<string>();
  public defaultSort: Sort = {active: 'date_de_lacte', direction: 'desc'};
  private filter = '';
  public etatPublication = '0';
  private subscription: Subscription = new Subscription();
  selection = new SelectionModel<Publication>(true, []);
  user: User;
  nombrePublicationLibelle = 'Nombre de publications à valider';
  valueSearchInput = '';
  valueSirenAdmin=''

  // tslint:disable-next-line:max-line-length
  constructor(public dialog: MatDialog, public store: Store<GlobalState>, public service: PublicationsService,
              private route: ActivatedRoute,
              private http: HttpClient) { }

  public ngOnInit(): void {

    this.store.pipe(select(selectAuthState), take(1)).subscribe((state) => {
      this.user = state.user;
    });
    this.store.pipe(select(selectAllPublication)).subscribe(publications => this.initializeData(publications));
    this.store.pipe(select(selectPublicationTotal)).subscribe(total => this.publicationTotal = total);
    this.subscription.add(this.store.pipe(select(selectPublicationLoading)).subscribe(loading => {
      if (loading) {
        this.dataSource = new MatTableDataSource(this.noData);
      }
      this.loading = loading;
    }));
    this.error$ = this.store.pipe(select(selectPublicationError));
    // pour éviter l'erreur suivante on passe loading à true avant ngAfterViewInit ==> this.loadPublications();
    // NG0100: Expression has changed after it was checked
    this.loading = true;

  }

  public ngAfterViewInit(): void {
    this.loadPublications();

    const filter$ = this.filterSubject.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap((value: string) => {
          this.paginator.pageIndex = 0;
          this.filter = value;
          if (this.filter === '' ) {
            this.selection.clear();
          }
      })
    );

    const siren$ = this.filterSiren.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap((value: string) => {
        if(value.length === 9){
          this.valueSirenAdmin = value;
        }
      })
    );

    this.dataSource.sort = this.sort;

    const sort$ = this.sort.sortChange.pipe(tap(() => this.paginator.pageIndex = 0));

    this.subscription.add(merge(siren$,filter$, sort$, this.paginator.page,).pipe(
      tap(() => this.loadPublications())
    ).subscribe());



    this.route.queryParams
      .pipe(
        filter(params => params.etat)
      )
      .subscribe(params => {
          if (params.etat !== this.etatPublication) {
            this.etatPublication = params.etat;
            this.selection.clear();
            this.loadPublications();
          }
        }
      );
  }

  is_admin_open_data(): boolean{
    if ( this.user === null) {
      return false;
    }
    return  this.user.userType === 'ADMIN';
  }

  private loadPublications(): void {
    // si vide on recherhce tous les état, si 1 alors uniquement les non publié
    let etatParam = '0';
    this.etatPublication === 'all' ? etatParam = '' : etatParam = '0';
    let estMasqueParam: boolean;
    this.etatPublication === 'all' ? estMasqueParam = true : estMasqueParam = false;

    if ( this.is_admin_open_data() && this.valueSirenAdmin.length === 9 ){
      //cas admin
      this.store.dispatch(new PublicationLoadAction(
        {
          filter: this.filter.toLocaleLowerCase(),
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          sortDirection: this.sort.direction,
          sortField: this.sort.active,
          siren: this.valueSirenAdmin,
          etat: '',
          est_masque: true
          // est_supprime: true

        } as PublicationParams
      ));
    }else {
      this.store.dispatch(new PublicationLoadAction(
        {
          filter: this.filter.toLocaleLowerCase(),
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          sortDirection: this.sort.direction,
          sortField: this.sort.active,
          siren: this.user.siren,
          etat: etatParam,
          est_masque: estMasqueParam

        } as PublicationParams
      ));
    }


  }

  private initializeData(publications: Publication[]): void {
    this.dataSource = new MatTableDataSource(publications.length ? publications : this.noData);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public retry(): void {
    this.loadPublications();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Publication): string {
    // this.selection.selected.length > 0 ?
    //   this.open_toolbar() :
    //   this.close_toolbar();
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  getPublicationLibelle(openData: string): string {
    switch (openData) {
      case '3': {
        return 'oui';
      }
      case '1': {
        return 'non';
      }
      case '2': {
        return 'Ne sais pas';
      }
      default: {
        return 'oui';
      }
    }
  }

  getTypeActeLibelle(acteNature: string): string {
    switch (acteNature) {
      case '1': {
        return 'Délibération';
      }
      case '2': {
        return 'Acte réglementaire';
      }
      case '3': {
        return 'Acte individuel';
      }
      case '4': {
        return 'Contrat,convention et avenant';
      }
      case '6': {
        return 'Autre';
      }
      case '5': {
        return 'Budget';
      }
      default: {
        return 'autre';
      }
    }
  }

  delete(element:DataDialog): void {
    this.loading = true;
    this.service.delete(element.id).toPromise().then((value) => this.refresh());
  }

  modify(element:Publication): void {
    this.loading = true;
    this.service.modify(element).toPromise().then((value) => this.refresh());
  }

  publish(): void {
    this.loading = true;
    this.selection.selected.forEach(row => this.publishOne(row));
  }

  private publishOne(row: Publication): void {
    this.service.publish(row.id).toPromise().then((value) => this.refresh());
  }

  unpublish(): void {
    this.loading = true;
    this.selection.selected.forEach(row => this.unpublishOne(row));
  }

  private unpublishOne(row: Publication): void {
    this.service.unpublish(row.id).toPromise().then((value) =>  this.refresh());
  }

  dontPusblish(): void {
    this.loading = true;
    this.selection.selected.forEach(row => this.dontPusblishOne(row));
  }

  dontPusblishOne(row: Publication): void {
    this.service.dontPusblish(row.id).toPromise().then((value) =>  this.refresh());
  }

  rowClick(row): void {
    this.selection.isSelected(row) ? this.selection.deselect(row) : this.selection.select(row);
  }

  getEtatLibelle(etat: string): string {
    switch (etat) {
      case '0': {
        return 'Non publié';
      }
      case '1': {
        return 'Publié';
      }
      case '2': {
        return 'En cours';
      }
      case '3': {
        return 'En erreur';
      }
      default: {
        return 'Autre';
      }
    }
  }

  refresh(): void {
    this.selection.clear();
    this.loadPublications();
  }

  msg_alert(msg: string): void {
    alert(msg);
  }

  openActe(event,element:Publication): void {
    event.stopPropagation();
    // this.selection.selected.length === 1 ?
    //   window.open(this.selection.selected[0].actes[0].url, '_blank').focus() :
    //   this.msg_alert('Merci de selectioner 1 ligne');
    this.http.get(element.actes[0].url, { responseType: 'blob' }).toPromise().then( blob =>
      {
        const a    = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.target = '_blank';
        a.click();
      }
    );
  }

  getLibelleFilter(): string {
    return this.filter !== '' ? ' (avec filtre : ' + this.filter + ')' : '';
  }
  getLibelleNombre(): string {
    return this.etatPublication !== '0' ? this.nombrePublicationLibelle = 'Nombre de publications' : this.nombrePublicationLibelle = 'Nombre de publications à valider';
  }
  openDialog(event, action, obj: Publication): void {
    event.stopPropagation();

    let data: DataDialog;

    if (action === "Update") {
      data =
        {...obj, action: action, title: "Modification de l'objet"};
    } else {
      data =
        {...obj, action: action, title: "Suppression de l'acte"};
    }

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '600px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Update'){
        this.service.modify(result.data).toPromise().then((value) => this.refresh());
      }else if (result.event === 'Delete'){
        this.service.delete(result.data.id).toPromise().then((value) => this.refresh());
      }
    });
  }
  clearInput(): void{
    this.filterSubject.next("")
    this.valueSearchInput =''
    this.selection.clear();
  }




}


