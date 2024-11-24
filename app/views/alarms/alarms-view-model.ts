import { Observable } from '@nativescript/core';
import { LocalNotifications } from '@nativescript/local-notifications';

interface Alarm {
    id: number;
    time: string;
    label: string;
    enabled: boolean;
    repeatDays: string;
    days: number[];
    sound: string;
    vibrate: boolean;
}

export class AlarmsViewModel extends Observable {
    private _alarms: Alarm[] = [];

    constructor() {
        super();
        this.loadAlarms();
    }

    get alarms(): Alarm[] {
        return this._alarms;
    }

    addAlarm() {
        // Implementation for adding new alarm
        const newAlarm: Alarm = {
            id: Date.now(),
            time: '08:00',
            label: 'Nueva Alarma',
            enabled: true,
            repeatDays: 'Una vez',
            days: [],
            sound: 'default',
            vibrate: true
        };

        this._alarms.push(newAlarm);
        this.notifyPropertyChange('alarms', this._alarms);
        this.scheduleAlarm(newAlarm);
    }

    private scheduleAlarm(alarm: Alarm) {
        if (!alarm.enabled) return;

        const [hours, minutes] = alarm.time.split(':').map(Number);
        const now = new Date();
        const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        LocalNotifications.schedule([{
            id: alarm.id,
            title: alarm.label,
            body: 'Hora de despertar',
            at: scheduledTime,
            sound: alarm.sound,
            badge: 1
        }]);
    }

    private loadAlarms() {
        // Load saved alarms from storage
        this._alarms = [];
        this.notifyPropertyChange('alarms', this._alarms);
    }
}