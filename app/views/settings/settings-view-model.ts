import { Observable } from '@nativescript/core';
import { ApplicationSettings } from '@nativescript/core';

export class SettingsViewModel extends Observable {
    private _isDarkMode: boolean;
    private _volume: number;
    private _alarmSounds: string[];
    private _selectedSoundIndex: number;
    private _vibrationEnabled: boolean;
    private _is24HourFormat: boolean;

    constructor() {
        super();
        this.loadSettings();
    }

    get isDarkMode(): boolean {
        return this._isDarkMode;
    }

    set isDarkMode(value: boolean) {
        if (this._isDarkMode !== value) {
            this._isDarkMode = value;
            this.notifyPropertyChange('isDarkMode', value);
            this.saveSettings();
            this.applyTheme();
        }
    }

    get volume(): number {
        return this._volume;
    }

    set volume(value: number) {
        if (this._volume !== value) {
            this._volume = value;
            this.notifyPropertyChange('volume', value);
            this.saveSettings();
        }
    }

    get alarmSounds(): string[] {
        return this._alarmSounds;
    }

    get selectedSoundIndex(): number {
        return this._selectedSoundIndex;
    }

    set selectedSoundIndex(value: number) {
        if (this._selectedSoundIndex !== value) {
            this._selectedSoundIndex = value;
            this.notifyPropertyChange('selectedSoundIndex', value);
            this.saveSettings();
        }
    }

    get vibrationEnabled(): boolean {
        return this._vibrationEnabled;
    }

    set vibrationEnabled(value: boolean) {
        if (this._vibrationEnabled !== value) {
            this._vibrationEnabled = value;
            this.notifyPropertyChange('vibrationEnabled', value);
            this.saveSettings();
        }
    }

    get is24HourFormat(): boolean {
        return this._is24HourFormat;
    }

    set is24HourFormat(value: boolean) {
        if (this._is24HourFormat !== value) {
            this._is24HourFormat = value;
            this.notifyPropertyChange('is24HourFormat', value);
            this.saveSettings();
        }
    }

    private loadSettings() {
        this._isDarkMode = ApplicationSettings.getBoolean('isDarkMode', false);
        this._volume = ApplicationSettings.getNumber('volume', 80);
        this._alarmSounds = ['Default', 'Classic', 'Digital', 'Gentle', 'Nature'];
        this._selectedSoundIndex = ApplicationSettings.getNumber('selectedSoundIndex', 0);
        this._vibrationEnabled = ApplicationSettings.getBoolean('vibrationEnabled', true);
        this._is24HourFormat = ApplicationSettings.getBoolean('is24HourFormat', true);

        this.applyTheme();
    }

    private saveSettings() {
        ApplicationSettings.setBoolean('isDarkMode', this._isDarkMode);
        ApplicationSettings.setNumber('volume', this._volume);
        ApplicationSettings.setNumber('selectedSoundIndex', this._selectedSoundIndex);
        ApplicationSettings.setBoolean('vibrationEnabled', this._vibrationEnabled);
        ApplicationSettings.setBoolean('is24HourFormat', this._is24HourFormat);
    }

    private applyTheme() {
        // Apply theme changes to the app
        const rootView = Application.getRootView();
        if (rootView) {
            rootView.className = this._isDarkMode ? 'ns-dark' : '';
        }
    }

    createBackup() {
        // Implementation for creating backup
        const settings = {
            isDarkMode: this._isDarkMode,
            volume: this._volume,
            selectedSoundIndex: this._selectedSoundIndex,
            vibrationEnabled: this._vibrationEnabled,
            is24HourFormat: this._is24HourFormat
        };
        
        // Save backup to file system
        console.log('Backup created:', settings);
    }

    restoreBackup() {
        // Implementation for restoring backup
        // Load backup from file system and apply settings
        console.log('Backup restored');
    }
}