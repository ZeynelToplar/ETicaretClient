import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner/public_api';

export class BaseComponent {

  constructor(private spinner : NgxSpinnerService) {}

  ShowSpinner(spinnerNameType: SpinnerType){
    this.spinner.show(spinnerNameType);
    setTimeout(() => {
      this.HideSpinner(spinnerNameType)
    }, 1000);
  }

  HideSpinner(spinnerNameType: SpinnerType){
    this.spinner.hide(spinnerNameType);
  }
}

export enum SpinnerType {
  Pacman = "s1",
  Timer = "s2",
  Cog = "s3"
}
