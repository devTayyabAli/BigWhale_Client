// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import HelpCenterSubcategory from 'src/views/pages/help-center/subcategory'

const HelpCenterSubcategoryPage = ({ apiData }) => {
  return apiData ? <HelpCenterSubcategory data={apiData.data} activeTab={apiData.activeTab} /> : null
}

// Replaced getStaticPaths + getStaticProps with getServerSideProps.
// The original implementation called a fake-db mock endpoint at build time
// which doesn't exist in production, causing Docker build failures.
export const getServerSideProps = async ({ params }) => {
  try {
    const res = await axios.get('/pages/help-center/subcategory', {
      params: { category: params?.category, subcategory: params?.subcategory }
    })

    return { props: { apiData: res.data } }
  } catch {
    return { props: { apiData: null } }
  }
}

export default HelpCenterSubcategoryPage
