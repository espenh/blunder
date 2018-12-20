import React from "react";
import * as highcharts from "highcharts";
import { blue } from "@material-ui/core/colors";
import _ from "lodash";

export interface IMoveScore {
    sequence: number;
    moveMadeBy: PieceColor;
    move: string;
    score: {
        b: number,
        w: number
    };
}

export interface IMoveDataPoint extends highcharts.Point {
    sequence: number;
    moveMadeBy: PieceColor;
    move: string;
    previousScore: number;
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
                    type: "area",
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
                softMax: 1,
                plotLines: [{
                    value: 0,
                    color: 'rgba(255,255,255,0.3)',
                    width: 1,
                    zIndex: 4
                }]
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.1
                },
                series: {
                    lineWidth: 1.5,
                    marker: {
                        enabled: true
                    },
                    tooltip: {
                        headerFormat: undefined,
                        pointFormatter: function () {
                            // This is messy, but we're essentially just picking stuff from the data
                            // point and creating a decent tooltip.
                            const self = (this as any) as IMoveDataPoint;
                            const score = self.y === undefined ? 0 : _.round(self.y, 1);

                            const diff = _.round(score - self.previousScore, 1);
                            const diffText = diff > 0 ? "+" + diff : diff;
                            return `${self.moveMadeBy === "w" ? "White" : "Black"} played ${self.move} <b>${score}</b> (${diffText})`;
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
        const seriesData = this.props.scores.map((score, scoreIndex) => {
            // TODO: This previousScore calculation in this iteration seems out of place.
            const previousScore = scoreIndex > 0 ? this.props.scores[scoreIndex - 1].score : { b: 0, w: 0 };

            return {
                x: score.sequence,
                y: score.score.w - score.score.b,
                moveMadeBy: score.moveMadeBy,
                move: score.move,
                previousScore: previousScore.w - previousScore.b
            };
        });

        scoreSeries.setData(seriesData);
    }

    public render() {
        return <div className="score-chart" ref={this.captureContainer}></div>
    }
}
