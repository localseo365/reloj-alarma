import { Observable } from '@nativescript/core';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export class ClockViewModel extends Observable {
    private _time: string = '';
    private _date: string = '';
    private _timezone: string = '';
    private _worldClocks: Array<any> = [];
    private _timer: number;

    constructor() {
        super();
        this.updateTime();
        this._timer = setInterval(() => this.updateTime(), 1000);
        this.initializeWorldClocks();
    }

    get time(): string {
        return this._time;
    }

    get date(): string {
        return this._date;
    }

    get timezone(): string {
        return this._timezone;
    }

    get worldClocks(): Array<any> {
        return this._worldClocks;
    }

    private updateTime() {
        const now = new Date();
        this.set('time', format(now, 'HH:mm:ss', { locale: es }));
        this.set('date', format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }));
        this.set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
        this.updateWorldClocks();
    }

    private initializeWorldClocks() {
        this._worldClocks = [
            { city: 'Nueva York', timezone: 'America/New_York' },
            { city: 'Londres', timezone: 'Europe/London' },
            { city: 'Tokio', timezone: 'Asia/Tokyo' }
        ];
    }

    private updateWorldClocks() {
        const updatedClocks = this._worldClocks.map(clock => ({
            ...clock,
            time: new Date().toLocaleTimeString('es-ES', { timeZone: clock.timezone })
        }));
        this.set('worldClocks', updatedClocks);
    }

    dispose() {
        if (this._timer) {
            clearInterval(this._timer);
        }
    }
}