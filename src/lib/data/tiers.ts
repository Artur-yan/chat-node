const tiersMap = {
	0: {
		name: 'Free',
		max_bot: 1,
		max_msg: 50,
		max_tocken: 100000,
		history_length_days: 1,
		features: {
			slack: {
				included: false,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: false,
				label: 'Remove ChatNode Branding'
			},
			notion: {
				included: false,
			}
		}
	},
	1: {
		name: 'Basic',
		max_bot: 5,
		max_msg: 2000,
		max_tocken: 400000,
		history_length_days: 3,
		features: {
			slack: {
				included: false,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: false,
				label: 'Remove ChatNode Branding'
			},
			notion: {
				included: false,
			}
		}
	},
	101: {
		name: 'Basic - Annual',
		max_bot: 5,
		max_msg: 2000,
		max_tocken: 400000,
		history_length_days: 3,
		features: {
			slack: {
				included: false,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: false,
				label: 'Remove ChatNode Branding'
			},
			notion: {
				included: false,
			}
		}
	},
	2: {
		name: 'Pro',
		max_bot: 10,
		max_msg: 5000,
		max_tocken: 1000000,
		history_length_days: 7,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	102: {
		name: 'Pro - Annual',
		max_bot: 10,
		max_msg: 5000,
		max_tocken: 1000000,
		history_length_days: 7,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	3: {
		name: 'Enterprise',
		max_bot: 20,
		max_msg: 10000,
		max_tocken: 3000000,
		history_length_days: 30,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	103: {
		name: 'Enterprise',
		max_bot: 20,
		max_msg: 10000,
		max_tocken: 3000000,
		history_length_days: 30,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	4: {
		name: 'Enterprise +',
		max_bot: 40,
		max_msg: 40000,
		max_tocken: 8000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	104: {
		name: 'Enterprise +',
		max_bot: 40,
		max_msg: 40000,
		max_tocken: 8000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	5: {
		name: 'Standard - Monthly',
		max_bot: 3,
		max_msg: 5000,
		max_tocken: 100000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: false,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: true,
			}
		}
	},
	105: {
		name: 'Standard - Annual',
		max_bot: 3,
		max_msg: 5000,
		max_tocken: 100000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: false,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: false,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: true,
			}
		}
	},
	6: {
		name: 'Growth - Monthly',
		max_bot: 5,
		max_msg: 10000,
		max_tocken: 1000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: true,
			}
		}
	},
	106: {
		name: 'Growth - Annual',
		max_bot: 5,
		max_msg: 10000,
		max_tocken: 1000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion : {
				included: true,
			}
		}
	},
	1001: {
		name: 'AppSumo: Tier 1',
		max_bot: 10,
		max_msg: 2000,
		max_tocken: 500000,
		history_length_days: 3,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: false,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	1002: {
		name: 'AppSumo: Tier 2',
		max_bot: 20,
		max_msg: 4000,
		max_tocken: 1000000,
		history_length_days: 3,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	1003: {
		name: 'AppSumo: Tier 3',
		max_bot: 40,
		max_msg: 6000,
		max_tocken: 2000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			chat_history: {
				included: true,
				label: '60 Day Chat History'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	1004: {
		name: 'AppSumo: Tier 4',
		max_bot: 60,
		max_msg: 8000,
		max_tocken: 4000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			chat_history: {
				included: true,
				label: '60 Day Chat History'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	1005: {
		name: 'AppSumo: Tier 5',
		max_bot: 80,
		max_msg: 10000,
		max_tocken: 8000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			chat_history: {
				included: true,
				label: '60 Day Chat History'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	},
	1006: {
		name: 'AppSumo: Tier 6',
		max_bot: -1,
		max_msg: 0,
		max_tocken: 8000000,
		history_length_days: 60,
		features: {
			slack: {
				included: true,
				label: 'Slack Integration'
			},
			gpt_api: {
				included: true,
				label: 'Bring Your Own ChatGPT API Key'
			},
			chatnode_api: {
				included: true,
				label: 'ChatNode API'
			},
			remove_chatnode_branding: {
				included: true,
				label: 'Remove ChatNode Branding'
			},
			chat_history: {
				included: true,
				label: '60 Day Chat History'
			},
			crisp: {
				included: true,
				label: 'Let users talk to a real person via a Crisp integration'
			},
			notion: {
				included: false,
			}
		}
	}
};

export default tiersMap;
