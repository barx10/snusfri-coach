export interface MotivationData {
    goalReminder: string;
    quoteOrFact: string;
    brutalMotivation: string;
}

export interface UserSettings {
    quitDate: number;
    dailyCost: number;
    savingsGoal: string;
    savingsGoalCost: number;
    currency: string;
}

export interface HealthMilestone {
    id: string;
    title: string;
    description: string;
    hoursRequired: number;
    icon?: string;
}