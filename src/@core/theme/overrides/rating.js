// ** BIGWHALE — Rating Overrides
const MuiRating = () => {
  return {
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#F59E0B',
          '& .MuiRating-iconEmpty': {
            color: 'rgba(245,158,11,0.25)',
          },
          '& .MuiRating-iconHover': {
            color: '#FCD34D',
            transform: 'scale(1.2)',
          },
          '& .MuiRating-iconFilled': {
            filter: 'drop-shadow(0 0 3px rgba(245,158,11,0.5))',
          },
        },
        iconFilled: { color: '#F59E0B' },
        iconHover: { color: '#FCD34D' },
      },
    },
  }
}

export default MuiRating
