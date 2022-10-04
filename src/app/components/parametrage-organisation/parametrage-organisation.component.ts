import {AfterViewInit, Component, OnInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {GlobalState, selectAuthState} from '../../store/states/global.state';
import {selectPublicationError, } from '../../store/selectors/publication.selectors';
import {selectAllParametrage, selectParametrageLoading} from '../../store/selectors/parametrage.selectors';
import {Parametrage} from '../../models/parametrage';

import {ParametrageLoadAction, ParametrageUpdateAction} from '../../store/actions/parametrage.actions';
import {take} from 'rxjs/operators';
import {User} from '../../models/user';


@Component({
  selector: 'app-parametrage-organisation',
  templateUrl: './parametrage-organisation.component.html',
  styleUrls: ['./parametrage-organisation.component.css']
})
export class ParametrageOrganisationComponent implements OnInit, AfterViewInit  {

  private subscription: Subscription = new Subscription();
  public noData: boolean;
  public loading: boolean;
  public error$: Observable<boolean>;

  parametrageFromStore: Parametrage;
  parametrage: Parametrage;
  user: User;
  isChecked = false;

  form: UntypedFormGroup;

  constructor(public store: Store<GlobalState>, public formBuilder: UntypedFormBuilder) {
    this.form = formBuilder.group({
      enableDataGouv: formBuilder.control(false),
      uid: formBuilder.control(''),
      apiKey: formBuilder.control(''),
    });
    // disable formulaire data gouv
    // this.form.disable();


  }

  ngOnInit(): void {
    this.store.pipe(select(selectAuthState), take(1)).subscribe((state) => {
      this.user = state.user;
    });
    this.store.pipe(select(selectAllParametrage)).subscribe(parametrage => this.initializeFormData(parametrage));

    this.subscription.add(this.store.pipe(select(selectParametrageLoading)).subscribe(loading => {
      if (loading) {
        this.noData = true;
      }
      this.loading = loading;
    }));
    this.error$ = this.store.pipe(select(selectPublicationError));
  }

  ngAfterViewInit(): void {
    this.loadParametrage();
  }

  private loadParametrage(): void {
    this.store.dispatch(new ParametrageLoadAction(this.user.siren));
  }

  private initializeFormData(parametrages: Parametrage[]): void {
    if (parametrages.length > 0 && (typeof (parametrages[0].id) !== 'undefined')) {
      this.parametrageFromStore = parametrages[0];
      this.isChecked = this.parametrageFromStore.open_data_active;
      this.form.reset(
        {
          enableDataGouv: this.parametrageFromStore.publication_data_gouv_active,
          uid: this.parametrageFromStore.uid_data_gouv,
          apiKey: this.parametrageFromStore.api_key_data_gouv
        });
    }else{
      this.form.reset(
        {
          enableDataGouv: false,
          uid: '',
          apiKey: ''
        });
    }

  }

  onFormSubmit(): void{
    // this.store.dispatch(new ParametrageUpdateAction(this.parametrage));
    // alert(JSON.stringify(this.form.value, null, 2));
    let id = 0;
    if (typeof (this.parametrageFromStore) !== 'undefined'){
      id = this.parametrageFromStore.id;
    }
    const parametrage = (({
      id,
      open_data_active: this.isChecked,
      publication_data_gouv_active: this.form.value.enableDataGouv,
      uid_data_gouv: this.form.value.uid,
      api_key_data_gouv: this.form.value.apiKey,
      siren : this.user.siren
    }) as Parametrage);

    this.store.dispatch(new ParametrageUpdateAction(parametrage));
  }

  onChangeActivationOpenData(): void {
    let id = 0;
    if (typeof (this.parametrageFromStore) !== 'undefined'){
      id = this.parametrageFromStore.id;
    }
    const parametrage = (({
      id,
      open_data_active: this.isChecked,
      publication_data_gouv_active: this.form.value.enableDataGouv,
      uid_data_gouv: this.form.value.uid,
      api_key_data_gouv: this.form.value.apiKey,
      siren : this.user.siren
    }) as Parametrage);

    this.store.dispatch(new ParametrageUpdateAction(parametrage));
  }
}
