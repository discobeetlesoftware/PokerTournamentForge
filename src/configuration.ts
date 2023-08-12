export let configuration = {
    global: {
        drawerWidth: 280
    },
    defaults: {
        minimum_denomination: 25,
        color_up_threshold: 0.15,
        form: {
            level_duration: {
                min: 1,
                max: 4 * 60,
                step: 1
            },
            break_duration: {
                min: 1,
                max: 2 * 60,
                step: 1
            },
            break_threshold: {
                min: 1,
                max: 12,
                step: 1
            },
            target_blind_ratio: {
                min: 0.05,
                max: 5,
                step: 0.05
            },
            starting_stack: {
                min: 1000,
                max: 1_000_000,
                step: 500
            },
            player_count: {
                min: 2,
                max: 200,
                step: 1
            },
            target_duration: {
                min: 30,
                max: 24 * 60,
                step: 15
            }
        }
    },
    strings: {
        en: {
            app: {
                name: 'Poker Tournament Forge',
            },
            nav: {
                home: 'Home',
                chip_sets: 'Chip sets',
                tournaments: 'Tournaments',
                about: 'About',
                settings: 'Settings'
            },
            welcome: {
                title: 'Welcome',
                overview: '%app.name% is a web app which allows you to create structures for poker tournaments. You can optionally add your own chip sets. If you input chip quantities, the app will generate proposed starting stacks. There are pre-configured tournaments which can be customized or used as-is.',
                detail: 'All the data you input stays entirely on your device.',
                contact: 'Missing a feature? Find a bug?',
                lmk: 'Let me know!'
            },
            about: {
                title: 'About',
                overview: 'This app was built by Allyn Bauer/<a href="http://discobeetle.com" target="_blank" rel="noreferrer">Discobeetle Software</a>.',
                attributions: {
                    title: 'Attributions',
                    elements: [
                        'Various elements of the calculation logic from members of <a href="https://pokerchipforum.com" target="_blank" rel="noreferrer" title="Poker Chip Forum">Poker Chip Forum</a>.',
                        'Poker Chips icon by Adrien Coquet from <a href="https://thenounproject.com/coquet_adrien/" target="_blank" rel="noreferrer" title="Adrien Coquet @ Noun Project">Noun Project</a> (CC BY 3.0).',
                        'levels icon by elastic1studio from <a href="https://thenounproject.com/elastic1studio/" target="_blank" rel="noreferrer" title="elastic1studio @ Noun Project">Noun Project</a> (CC BY 3.0).',
                        'poker icon by Gan Khoon Lay from <a href="https://thenounproject.com/leremy/" target="_blank" rel="noreferrer" title="Gan Khoon Lay @ Noun Project">Noun Project</a> (CC BY 3.0).',
                        'flower vase icon by Gan Khoon Lay from <a href="https://thenounproject.com/leremy/" target="_blank" rel="noreferrer" title="Gan Khoon Lay @ Noun Project">Noun Project</a> (CC BY 3.0).',
                        'Ace of Spades icon by Firza Alamsyah from <a href="https://thenounproject.com/crlxsens/" target="_blank" rel="noreferrer" title="Firza Alamsyah @ Noun Project">Noun Project</a> (CC BY 3.0).',
                        'Ace of Diamonds icon by Firza Alamsyah from <a href="https://thenounproject.com/crlxsens/" target="_blank" rel="noreferrer" title="Firza Alamsyah @ Noun Project">Noun Project</a> (CC BY 3.0).',
                        'Ace of Clubs icon by Firza Alamsyah from <a href="https://thenounproject.com/crlxsens/" target="_blank" rel="noreferrer" title="Firza Alamsyah @ Noun Project">Noun Project</a> (CC BY 3.0).',
                        'Ace of Hearts icon by Firza Alamsyah from <a href="https://thenounproject.com/crlxsens/" target="_blank" rel="noreferrer" title="Firza Alamsyah @ Noun Project">Noun Project</a> (CC BY 3.0).'
                    ]
                }
            },
            chip_list: {
                title: 'Chip sets',
                no_customs: 'No custom sets to show.',
                overview: 'Added chip sets will appear here. Chip denominations will be used to determine the blind structure. Chip quantities will be used to create suggested starting stacks.',
                preset: 'Pre-set',
                custom: 'Custom',
                actions: {
                    new: 'new'
                }
            },
            tournament_list: {
                title: 'Tournaments',
                no_customs: 'No custom tournaments to show.',
                overview: 'Created tournaments will appear here.',
                preset: 'Pre-set',
                custom: 'Custom',
                actions: {
                    new: 'new'
                }
            },
            tournament: {
                title: {
                    create: 'Create new tournament',
                    update: 'Update %name%'
                },
                no_customs: 'No custom sets to show.',
                actions: {
                    save: 'Save',
                    cancel: 'Cancel',
                    edit: 'Edit',
                    delete: 'Delete',
                    create: 'Create',
                    update: 'Update'
                },
                form: {
                    tournament_name: {
                        name: 'Name',
                        tooltip: 'The name of the tournament'
                    },
                    games: {
                        name: 'Games',
                        tooltip: 'Comma separated list of games to map onto levels'
                    },
                    set_id: {
                        name: 'Chip set',
                        tooltip: 'The chip set on which to base the tournament structure',
                        placeholder: '•Any set•'
                    },
                    minimum_denomination: {
                        name: 'Smallest chip',
                        tooltip: 'The minimum denomination in the tournament',
                        placeholder: '•Auto•'
                    },
                    level_duration: {
                        name: 'Level duration',
                        tooltip: 'Duration of the levels'
                    },
                    break_duration: {
                        name: 'Break duration',
                        tooltip: 'Duration of the breaks'
                    },
                    break_threshold: {
                        name: 'Break threshold',
                        tooltip: 'Min and max level threshold for breaks'
                    },
                    target_blind_ratio: {
                        name: 'Target blind ratio',
                        tooltip: 'The target percentage for level-to-level blind increases'
                    },
                    target_strategy: {
                        name: 'Target strategy',
                        tooltip: 'How aggressively to apply the target blind ratio'
                    },
                    color_up_breakpoints: {
                        name: 'Color-up breakpoints',
                        tooltip: 'The blind value beyond which to color-up a given denomination'
                    },
                    starting_stack: {
                        name: 'Starting stack',
                        tooltip: 'Starting stack for players'
                    },
                    player_count: {
                        name: 'Player count',
                        tooltip: 'Estimated max number of players'
                    },
                    target_duration: {
                        name: 'Target duration',
                        tooltip: 'Duration of the tournament'
                    }
                }
            },
            error: {
                title: 'Error'
            },
            settings: {
                title: 'Settings'
            },
            chip: {
                subtitle: {
                    unsaved: 'Create new set',
                    custom: 'Update %setname%',
                    preset: 'Clone %setname%',
                    foreign: 'Clone %setname%'
                },
                chips: 'Chips',
                fields: {
                    name: {
                        placeholder: 'Set name',
                        title: 'Name'
                    }
                },
                actions: {
                    save: 'Save',
                    cancel: 'Cancel',
                    edit: 'Edit',
                    delete: 'Delete',
                    create: 'Create',
                    update: 'Update'
                },
                headers: {
                    actions: {
                        title: 'Actions',
                        width: 100
                    },
                    color: {
                        title: 'Color',
                        width: 200
                    },
                    quantity: {
                        title: 'Quantity',
                        width: 200
                    },
                    denom: {
                        title: 'Denom',
                        width: 100
                    }
                }
            }
        }
    }
};
