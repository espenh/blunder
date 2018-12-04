import React from "react";
import * as highcharts from "highcharts";

export interface IScoreChartProps {

}

export class ScoreChart extends React.Component<IScoreChartProps> {
    private chart!: highcharts.ChartObject;
    private container!: HTMLDivElement | null;

    private captureContainer = (container: HTMLDivElement | null) => {
        this.container = container;
    }

    public onComponentMount() {
        if (!this.container) {
            return;
        }

        this.chart = new highcharts.Chart(this.container, {
            title: {
                text: "abc"
            }
        });
    }

    public render() {
        return <div ref={this.captureContainer}></div>
    }
}
