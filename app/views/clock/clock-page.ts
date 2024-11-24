import { NavigatedData, Page } from '@nativescript/core';
import { ClockViewModel } from './clock-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new ClockViewModel();
}