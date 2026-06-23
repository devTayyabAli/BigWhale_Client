// ** BIGWHALE Navigation Config
const navigation = () => {
  return [
    {
      icon: 'tabler:smart-home',
      title: 'Dashboard',
      path: '/dashboards/analytics',
    },
    {
      title: 'Withdrawal',
      icon: 'tabler:arrow-up-right',
      children: [
        {
          title: 'Withdraw Funds',
          path: '/withdrawal',
        },
      ],
    },
    {
      title: 'Stake',
      icon: 'tabler:lock',
      children: [
        {
          title: 'Stake BW',
          path: '/stake',
        },
        {
          title: 'Stake History',
          path: '/stake-history',
        },
      ],
    },
    {
      title: 'Transaction',
      icon: 'tabler:arrows-exchange',
      children: [
        // {
        //   title: 'Fund Transfer',
        //   path: '/fund-transfer',
        // },
        {
          title: 'Buy BW',
          path: '/buy-funds',
        },
        {
          title: 'Sell BW',
          path: '/sell-funds',
        },
        {
          title: 'Buy History',
          path: '/buy-funds-history',
        },
        {
          title: 'Sell History',
          path: '/sell-funds-history',
        },
      ],
    },
    {
      title: 'Team',
      icon: 'tabler:users',
      children: [
        {
          title: 'Direct Referral',
          path: '/team/active-referral',
        },
        {
          title: 'Downline',
          path: '/team/active-downline',
        },
      ],
    },
    {
      title: 'Rewards',
      icon: 'tabler:trophy',
      children: [
        {
          title: 'Staking Rewards',
          path: '/bonus/staking-reward-bonus',
        },
        {
          title: 'Instant Bonus',
          path: '/bonus/instant-bonus',
        },
        {
          title: 'Referral Income',
          path: '/bonus/referral-income-bonus',
        },
        // {
        //   title: 'Leadership Bonus',
        //   path: '/bonus/leadership-bonus',
        // },
        {
          title: 'Rank Status',
          path: '/bonus/rank-status',
        },
        {
          title: 'Salary Rank History',
          path: '/bonus/salary-rank-history',
        },
      ],
    },
    {
      title: 'Ecosystem',
      icon: 'tabler:world',
      children: [
        {
          title: 'Business Plan',
          path: '/assets/pdf/BW.pdf',
        },
      ],
    },
    {
      title: 'Support',
      icon: 'tabler:headset',
      children: [
        {
          title: 'Create Ticket',
          path: '/support',
        },
        {
          title: 'Ticket History',
          path: '/support-history',
        },
      ],
    },
  ]
}

export default navigation
