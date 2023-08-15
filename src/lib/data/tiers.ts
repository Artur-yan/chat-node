const tiersMap = {
	1001: {
		name: 'AppSumo: Tier 1',
		max_bot: 10,
		max_msg: 2000,
		max_tocken: 500000,
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
			}
		}
	},
	1002: {
		name: 'AppSumo: Tier 2',
		max_bot: 20,
		max_msg: 4000,
		max_tocken: 1000000,
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
			}
		}
	},
	1003: {
		name: 'AppSumo: Tier 3',
		max_bot: 40,
		max_msg: 6000,
		max_tocken: 1500000,
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
			}
		}
	},
	1004: {
		name: 'AppSumo: Tier 4',
		max_bot: 60,
		max_msg: 8000,
		max_tocken: 2000000,
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
			}
		}
	},
	1005: {
		name: 'AppSumo: Tier 5',
		max_bot: 80,
		max_msg: 10000,
		max_tocken: 3000000,
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
			}
		}
	}
};

export default tiersMap;
