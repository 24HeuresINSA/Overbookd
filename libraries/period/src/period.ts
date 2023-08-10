export interface IProvidePeriod {
    start: Date;
    end: Date;
}

export class Period {
    start: Date;
    end: Date;

    private constructor(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    static init({ start, end }: IProvidePeriod): Period {
        return new Period(start, end);
    }

    isIncludedBy(otherPeriod: Period): boolean {
        return (
            otherPeriod.start.getTime() <= this.start.getTime() &&
            otherPeriod.end.getTime() >= this.start.getTime()
        );
    }

    isFollowedBy(otherPeriod: Period): boolean {
        return (
            this.start.getTime() <= otherPeriod.end.getTime() &&
            this.end.getTime() >= otherPeriod.start.getTime()
        );
    }

    mergeWith(otherPeriod: Period): Period {
        const start = new Date(Math.min(otherPeriod.start.getTime(), this.start.getTime()))
        const end = new Date(Math.max(otherPeriod.end.getTime(), this.end.getTime()))
        return new Period(start, end)
    }

    splitFrom(otherPeriod: IProvidePeriod): Period[] {
        const pastPeriod = Period.init({
            start: this.start,
            end: otherPeriod.start,
        });
        const futurPeriod = Period.init({
            start: otherPeriod.end,
            end: this.end,
        });

        return [pastPeriod, futurPeriod].filter((period) => period.hasDuration)
    }

    get hasDuration(): boolean {
        return this.start.getTime() !== this.end.getTime()
    }
}
