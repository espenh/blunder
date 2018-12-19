import React from "react";
import * as highcharts from "highcharts";
import { blue } from "@material-ui/core/colors";
import _ from "lodash";

export interface IMoveScore {
    sequence: number;
    move: string,
    score: {
        b: number,
        w: number
    };
}

export interface IScoreChartProps {
    scores: IMoveScore[];
}

export class ScoreChart extends React.Component<IScoreChartProps> {
    private chart!: highcharts.Chart;
    private container!: HTMLDivElement | null;

    private captureContainer = (container: HTMLDivElement | null) => {
        this.container = container;
    }

    public componentDidMount() {
        if (!this.container) {
            return;
        }

        this.chart = new highcharts.Chart(this.container, {
            title: {
                text: undefined
            },
            chart: {
                backgroundColor: "transparent"
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: [
                {
                    id: "scoreSeries",
                    name: "Score",
                    type: "line",
                    color: blue[500]
                }
            ],
            xAxis: {
                allowDecimals: false,
                lineWidth: 0
            },
            yAxis: {
                title: {
                    text: undefined
                },
                gridLineColor: 'rgba(255,255,255,0.1)',
                softMin: -1,
                softMax: 1
            },
            plotOptions: {
                series: {
                    tooltip: {
                        headerFormat: undefined,
                        pointFormatter: function () {
                            //const self = this as highcharts.Point;
                            //const score = self.y;
                            //return 'After : ' + self.x + ': ' + _.round(score, 1) + '</b>';
                            return "wip";
                        }
                    }
                }
            }
        });

        this.syncChartWithProps();
    }


    public componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    public componentDidUpdate() {
        this.syncChartWithProps();
    }

    private syncChartWithProps() {
        if (!this.chart) {
            return;
        }

        const scoreSeries = this.chart.get("scoreSeries") as highcharts.Series;
        const seriesData = this.props.scores.map((score) => {
            return {
                x: score.sequence,
                y: score.score.w - score.score.b
            };
        });

        scoreSeries.setData(seriesData);
    }

    public render() {
        return <div className="score-chart" ref={this.captureContainer}></div>
    }
}
