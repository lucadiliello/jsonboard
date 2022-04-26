import { Component } from 'react';
import { ResponsiveLine } from '@nivo/line'


class Plot extends Component {

    render() {
        const data = Object.entries(this.props.experiments)
            .filter(([key, value]) => value.active && value.data !== undefined && this.props.metric in value.data.logs)
            .map(([key, value]) => {
                return {
                    color: value.color,
                    id: key,
                    data: value.data.steps.map((step, index) => ({x: step, y: value.data.logs[this.props.metric][index]}))
                }
            }
        );

        return (
            <div style={{ height: '300px' }}>
                <div style={{ height: '100%', display: 'flex' }}>
                    <ResponsiveLine
                        theme={{background: "#ffffff", textColor: "#333333"}}
                        data={data}
                        colors={d => d.color}
                        margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
                        xScale={{type: 'point'}}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: true,
                            reverse: false
                        }}
                        yFormat=" >-.2f"
                        curve={this.props.plotStyle.lineType}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Step',
                            legendOffset: 30,
                            legendPosition: 'middle'
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: this.props.metric,
                            legendOffset: -40,
                            legendPosition: 'middle'
                        }}
                        enableSlices='x'
                        enablePoints={this.props.plotStyle.enablePoints}
                        enableGridY={this.props.plotStyle.enableGridY}
                        enableGridX={this.props.plotStyle.enableGridX}                       
                        lineWidth={this.props.plotStyle.lineWidth}
                        pointSize={8}
                        pointColor={{theme: 'background'}}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        useMesh={true}
                    />
                </div>
            </div>
        )
    }
}

export default Plot;