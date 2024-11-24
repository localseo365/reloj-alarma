import { NavigatedData, Page } from '@nativescript/core';
import { ClockViewModel } from './views/clock/clock-view-model';
import { AlarmsViewModel } from './views/alarms/alarms-view-model';
import { TimerViewModel } from './views/timer/timer-view-model';
import { SettingsViewModel } from './views/settings/settings-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const clockVM = new ClockViewModel();
    const alarmsVM = new AlarmsViewModel();
    const timerVM = new TimerViewModel();
    const settingsVM = new SettingsViewModel();
    
    page.bindingContext = {
        clock: clockVM,
        alarms: alarmsVM,
        timer: timerVM,
        settings: settingsVM
    };
}