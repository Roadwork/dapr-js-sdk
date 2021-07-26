export default class ActorReminderData {
    reminderName: string;
    state: any;
    dueTime: number;
    period: number;
    
    constructor(reminderName: string, state: any, dueTime: number, period: number) {
        this.reminderName = reminderName;
        this.state = state;
        this.dueTime = dueTime;
        this.period = period;
    }
}