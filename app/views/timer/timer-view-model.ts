import { Observable } from '@nativescript/core';

export class TimerViewModel extends Observable {
    private _hours: string = '00';
    private _minutes: string = '00';
    private _seconds: string = '00';
    private _isRunning: boolean = false;
    private _timer: number;
    private _remainingSeconds: number = 0;

    // Stopwatch properties
    private _stopwatchTime: string = '00:00:00';
    private _isStopwatchRunning: boolean = false;
    private _stopwatchTimer: number;
    private _stopwatchStart: number = 0;
    private _laps: string[] = [];

    constructor() {
        super();
    }

    // Timer getters and setters
    get hours(): string {
        return this._hours;
    }

    get minutes(): string {
        return this._minutes;
    }

    get seconds(): string {
        return this._seconds;
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    // Stopwatch getters
    get stopwatchTime(): string {
        return this._stopwatchTime;
    }

    get isStopwatchRunning(): boolean {
        return this._isStopwatchRunning;
    }

    get laps(): string[] {
        return this._laps;
    }

    // Timer methods
    toggleTimer() {
        if (this._isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    private startTimer() {
        this._isRunning = true;
        this.notifyPropertyChange('isRunning', true);

        this._timer = setInterval(() => {
            if (this._remainingSeconds > 0) {
                this._remainingSeconds--;
                this.updateDisplay();
            } else {
                this.stopTimer();
            }
        }, 1000);
    }

    private pauseTimer() {
        if (this._timer) {
            clearInterval(this._timer);
        }
        this._isRunning = false;
        this.notifyPropertyChange('isRunning', false);
    }

    resetTimer() {
        this.pauseTimer();
        this._remainingSeconds = 0;
        this.updateDisplay();
    }

    private updateDisplay() {
        const hours = Math.floor(this._remainingSeconds / 3600);
        const minutes = Math.floor((this._remainingSeconds % 3600) / 60);
        const seconds = this._remainingSeconds % 60;

        this._hours = hours.toString().padStart(2, '0');
        this._minutes = minutes.toString().padStart(2, '0');
        this._seconds = seconds.toString().padStart(2, '0');

        this.notifyPropertyChange('hours', this._hours);
        this.notifyPropertyChange('minutes', this._minutes);
        this.notifyPropertyChange('seconds', this._seconds);
    }

    // Stopwatch methods
    toggleStopwatch() {
        if (this._isStopwatchRunning) {
            this.pauseStopwatch();
        } else {
            this.startStopwatch();
        }
    }

    private startStopwatch() {
        this._isStopwatchRunning = true;
        this.notifyPropertyChange('isStopwatchRunning', true);

        const startTime = Date.now() - (this._stopwatchStart || 0);
        this._stopwatchTimer = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            this._stopwatchTime = this.formatTime(elapsedTime);
            this.notifyPropertyChange('stopwatchTime', this._stopwatchTime);
        }, 10);
    }

    private pauseStopwatch() {
        if (this._stopwatchTimer) {
            clearInterval(this._stopwatchTimer);
            this._stopwatchStart = Date.now() - this._stopwatchStart;
        }
        this._isStopwatchRunning = false;
        this.notifyPropertyChange('isStopwatchRunning', false);
    }

    lap() {
        this._laps.unshift(this._stopwatchTime);
        this.notifyPropertyChange('laps', this._laps);
    }

    resetStopwatch() {
        this.pauseStopwatch();
        this._stopwatchTime = '00:00:00';
        this._stopwatchStart = 0;
        this._laps = [];
        this.notifyPropertyChange('stopwatchTime', this._stopwatchTime);
        this.notifyPropertyChange('laps', this._laps);
    }

    private formatTime(ms: number): string {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    dispose() {
        if (this._timer) {
            clearInterval(this._timer);
        }
        if (this._stopwatchTimer) {
            clearInterval(this._stopwatchTimer);
        }
    }
}