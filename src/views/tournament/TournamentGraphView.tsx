import { DatumValue, ResponsiveLine } from '@nivo/line';
import { SecondaryBlockHeaderView } from '../SecondaryHeaderView';
import { TournamentLevelPayload, TournamentPayload } from '../../pipes/DataStoreSchemaV1';
import { ValueFormat } from '@nivo/core';
import { FormatterController } from '../../controllers/FormatterController';

export interface ChartDataPacket {
    x: number;
    y: number;
}

export interface ChartData {
    id: string;
    data: ChartDataPacket[];
}

const createGraphPayload = (tournament: TournamentPayload): { values: ChartData[], gridXLabels: number[] } => {
    const smallBlindKey = 'Small Blind';
    const bigBlindKey = 'Big Blind';
    const totalBlindKey = 'Total Blind';
    const targetKey = 'Target';
    var values: { [Name: string]: ChartDataPacket[]} = {
        [smallBlindKey]: [],
        [bigBlindKey]: [],
        [totalBlindKey]: [],
        [targetKey]: []
    };
    var totals: { [Name: string]: number} = {
        [smallBlindKey]: 0,
        [bigBlindKey]: 0,
        [totalBlindKey]: 0,
        [targetKey]: 0,
        round: 0,
        break: 0
    };

    var xValue = 0;
    var xValueLabels: number[] = [];
    var lastBreak: TournamentLevelPayload | undefined;

    function append(level: TournamentLevelPayload) {
        values[smallBlindKey].push({ x: xValue, y: totals[smallBlindKey] });
        values[bigBlindKey].push({ x: xValue, y: totals[bigBlindKey] });
        values[totalBlindKey].push({ x: xValue, y: totals[totalBlindKey] });
        values[targetKey].push({ x: xValue, y: totals[targetKey] });

        xValueLabels.push(xValue);
        xValue += level.duration || 0;
    }

    for (let level of tournament.levels) {
        totals[level.type] += 1;

        if (level.type === 'round') {
            const [smallBlind, bigBlind] = level.denominations || [0,0];
            totals[smallBlindKey] = smallBlind;
            totals[bigBlindKey] = bigBlind;
            totals[totalBlindKey] += (smallBlind + bigBlind);
            if (totals[targetKey] === 0) {
                totals[targetKey] = smallBlind;
            } else {
                totals[targetKey] += (totals[targetKey] * tournament.target_blind_ratio);
            }

            if (lastBreak) {
                append(lastBreak);
                lastBreak = undefined;
            }

            append(level);
        } else if (level.type === 'break') {
            lastBreak = level;
        }
    }
    const results = [smallBlindKey, bigBlindKey, targetKey].map(key => {
        return {
            id: key,
            data: values[key]
        };
    });
    return { values: results, gridXLabels: xValueLabels };
}

const minuteFormatter: ValueFormat<DatumValue> = (input) => {
    const minutes = input as number;
    return FormatterController.time(minutes);
};

export const TournamentGraphView = (props: { title: string, tournament: TournamentPayload }) => {
    const { title, tournament } = props;
    const { values, gridXLabels } = createGraphPayload(tournament);
    return (
        <>
            <SecondaryBlockHeaderView title={title} sx={{ mt: 1.5 }} />
            <div style={{ height: '400px' }}>
                <ResponsiveLine
                    data={values}
                    gridXValues={gridXLabels}
                    animate={true}
                    enableSlices='x'
                    margin={{ top: 30, right: 10, bottom: 50, left: 70 }}
                    xScale={{ type: 'linear' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                    }}
                    xFormat={minuteFormatter}
                    yFormat=" >-,.0f"
                    curve='linear'
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'minutes',
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'blinds',
                        legendOffset: -55,
                        legendPosition: 'middle',
                    }}
                    colors={{ scheme: 'category10' }}
                    lineWidth={3}
                    pointSize={6}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'top-left',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: -30,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            symbolSize: 10,
                            toggleSerie: true,
                            symbolShape: 'square',
                            symbolBorderColor: 'rgba(0, 0, 0, .8)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        },
                    ]}
                />
            </div>
        </>
    );
};
