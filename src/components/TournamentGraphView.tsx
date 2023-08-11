import { DatumValue, ResponsiveLine } from '@nivo/line';
import { SecondaryBlockHeaderView } from './SecondaryHeaderView';
import { TournamentLevelPayload, TournamentPayload } from '../pipes/DataStoreSchemaV1';
import dayjs from 'dayjs';
import Time from '../models/Time';
import Duration from '../models/Duration';
import { ValueFormat } from '@nivo/core';



export const testdata = [
    {
        "id": "japan",
        "color": "hsl(152, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 236
            },
            {
                "x": "helicopter",
                "y": 294
            },
            {
                "x": "boat",
                "y": 149
            },
            {
                "x": "train",
                "y": 135
            },
            {
                "x": "subway",
                "y": 249
            },
            {
                "x": "bus",
                "y": 161
            },
            {
                "x": "car",
                "y": 198
            },
            {
                "x": "moto",
                "y": 107
            },
            {
                "x": "bicycle",
                "y": 269
            },
            {
                "x": "horse",
                "y": 242
            },
            {
                "x": "skateboard",
                "y": 31
            },
            {
                "x": "others",
                "y": 229
            }
        ]
    },
    {
        "id": "france",
        "color": "hsl(50, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 255
            },
            {
                "x": "helicopter",
                "y": 24
            },
            {
                "x": "boat",
                "y": 151
            },
            {
                "x": "train",
                "y": 231
            },
            {
                "x": "subway",
                "y": 9
            },
            {
                "x": "bus",
                "y": 120
            },
            {
                "x": "car",
                "y": 66
            },
            {
                "x": "moto",
                "y": 196
            },
            {
                "x": "bicycle",
                "y": 133
            },
            {
                "x": "horse",
                "y": 181
            },
            {
                "x": "skateboard",
                "y": 56
            },
            {
                "x": "others",
                "y": 285
            }
        ]
    },
    {
        "id": "us",
        "color": "hsl(253, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 141
            },
            {
                "x": "helicopter",
                "y": 264
            },
            {
                "x": "boat",
                "y": 251
            },
            {
                "x": "train",
                "y": 217
            },
            {
                "x": "subway",
                "y": 47
            },
            {
                "x": "bus",
                "y": 178
            },
            {
                "x": "car",
                "y": 180
            },
            {
                "x": "moto",
                "y": 239
            },
            {
                "x": "bicycle",
                "y": 198
            },
            {
                "x": "horse",
                "y": 246
            },
            {
                "x": "skateboard",
                "y": 6
            },
            {
                "x": "others",
                "y": 291
            }
        ]
    },
    {
        "id": "germany",
        "color": "hsl(80, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 234
            },
            {
                "x": "helicopter",
                "y": 132
            },
            {
                "x": "boat",
                "y": 1
            },
            {
                "x": "train",
                "y": 208
            },
            {
                "x": "subway",
                "y": 50
            },
            {
                "x": "bus",
                "y": 24
            },
            {
                "x": "car",
                "y": 91
            },
            {
                "x": "moto",
                "y": 154
            },
            {
                "x": "bicycle",
                "y": 68
            },
            {
                "x": "horse",
                "y": 213
            },
            {
                "x": "skateboard",
                "y": 189
            },
            {
                "x": "others",
                "y": 120
            }
        ]
    },
    {
        "id": "norway",
        "color": "hsl(21, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 182
            },
            {
                "x": "helicopter",
                "y": 111
            },
            {
                "x": "boat",
                "y": 152
            },
            {
                "x": "train",
                "y": 46
            },
            {
                "x": "subway",
                "y": 84
            },
            {
                "x": "bus",
                "y": 151
            },
            {
                "x": "car",
                "y": 7
            },
            {
                "x": "moto",
                "y": 210
            },
            {
                "x": "bicycle",
                "y": 66
            },
            {
                "x": "horse",
                "y": 98
            },
            {
                "x": "skateboard",
                "y": 77
            },
            {
                "x": "others",
                "y": 224
            }
        ]
    }
];

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

// export type ScaleTimeSpec = {
//     type: 'time';
//     format?: 'native' | string;
//     precision?: TIME_PRECISION;
//     min?: 'auto' | Date | string;
//     max?: 'auto' | Date | string;
//     useUTC?: boolean;
//     nice?: boolean;
// };

const minuteFormatter: ValueFormat<DatumValue> = (input) => {
    const minutes = input as number;
    return new Duration(minutes).toString(minutes === 0);
};

//export type TicksSpec<Value extends ScaleValue> = number | string | Value[];

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
                        // {
                        //     anchor: 'bottom-right',
                        //     direction: 'column',
                        //     justify: false,
                        //     translateX: 100,
                        //     translateY: 0,
                        //     itemsSpacing: 0,
                        //     itemDirection: 'left-to-right',
                        //     itemWidth: 80,
                        //     itemHeight: 20,
                        //     itemOpacity: 0.75,
                        //     symbolSize: 15,
                        //     toggleSerie: true,
                        //     symbolShape: 'circle',
                        //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        //     effects: [
                        //         {
                        //             on: 'hover',
                        //             style: {
                        //                 itemBackground: 'rgba(0, 0, 0, .03)',
                        //                 itemOpacity: 1
                        //             }
                        //         }
                        //     ]
                        // }
                    ]}
                />
            </div>
        </>
    );
};
