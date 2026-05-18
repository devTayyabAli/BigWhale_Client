// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import AccountSettings from 'src/views/pages/account-settings/AccountSettings'

const AccountSettingsTab = ({ tab, apiPricingPlanData }) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />
}

// Static paths are safe — no API call needed here
export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } },
      { params: { tab: 'notifications' } },
      { params: { tab: 'connections' } }
    ],
    fallback: false
  }
}

// Replaced axios call with a safe fallback.
// The original called /pages/pricing (fake-db) at build time which doesn't
// exist in production, causing Docker build failures.
export const getStaticProps = async ({ params }) => {
  let apiPricingPlanData = []
  try {
    const res = await axios.get('/pages/pricing')
    apiPricingPlanData = res.data?.pricingPlans ?? []
  } catch {
    // Backend not available at build time — render with empty data
  }

  return {
    props: {
      tab: params?.tab,
      apiPricingPlanData
    }
  }
}

export default AccountSettingsTab
