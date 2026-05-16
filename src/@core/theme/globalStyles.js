const GlobalStyles = theme => {
  return {
    // ** BIGWHALE Global Styles
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0, 229, 255, 0.3) rgba(5, 8, 22, 0.5)',
    },
    '*::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '*::-webkit-scrollbar-track': {
      background: 'rgba(5, 8, 22, 0.5)',
    },
    '*::-webkit-scrollbar-thumb': {
      background: 'rgba(0, 229, 255, 0.3)',
      borderRadius: '3px',
      '&:hover': {
        background: 'rgba(0, 229, 255, 0.5)',
      },
    },

    // ** BIGWHALE Keyframe Animations
    '@keyframes bwPulseGlow': {
      '0%, 100%': {
        boxShadow: '0 0 10px rgba(0, 229, 255, 0.3), 0 0 20px rgba(0, 229, 255, 0.1)',
      },
      '50%': {
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.6), 0 0 40px rgba(0, 229, 255, 0.2)',
      },
    },
    '@keyframes bwPulsePurple': {
      '0%, 100%': {
        boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)',
      },
      '50%': {
        boxShadow: '0 0 25px rgba(168, 85, 247, 0.6)',
      },
    },
    '@keyframes bwFloat': {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-8px)' },
    },
    '@keyframes bwShimmer': {
      '0%': { backgroundPosition: '-200% center' },
      '100%': { backgroundPosition: '200% center' },
    },
    '@keyframes bwRotate': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    '@keyframes bwFadeInUp': {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    '@keyframes bwNeonBorder': {
      '0%, 100%': { borderColor: 'rgba(0, 229, 255, 0.4)' },
      '33%': { borderColor: 'rgba(168, 85, 247, 0.4)' },
      '66%': { borderColor: 'rgba(255, 46, 159, 0.4)' },
    },
    '@keyframes bwParticleFloat': {
      '0%': { transform: 'translateY(100vh) scale(0)', opacity: 0 },
      '10%': { opacity: 1 },
      '90%': { opacity: 1 },
      '100%': { transform: 'translateY(-100px) scale(1)', opacity: 0 },
    },
    '@keyframes bwWaveMove': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },

    // ** BIGWHALE Utility Classes
    '.bw-glow-cyan': {
      boxShadow: '0 0 15px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.15)',
    },
    '.bw-glow-purple': {
      boxShadow: '0 0 15px rgba(168, 85, 247, 0.4), 0 0 30px rgba(168, 85, 247, 0.15)',
    },
    '.bw-glow-pink': {
      boxShadow: '0 0 15px rgba(255, 46, 159, 0.4), 0 0 30px rgba(255, 46, 159, 0.15)',
    },
    '.bw-glass': {
      background: 'rgba(13, 18, 36, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 229, 255, 0.12)',
    },
    '.bw-glass-purple': {
      background: 'rgba(13, 18, 36, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(168, 85, 247, 0.15)',
    },
    '.bw-gradient-text': {
      background: 'linear-gradient(135deg, #00E5FF 0%, #A855F7 50%, #FF2E9F 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    '.bw-gradient-text-cyan': {
      background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    '.bw-pulse-glow': {
      animation: 'bwPulseGlow 3s ease-in-out infinite',
    },
    '.bw-float': {
      animation: 'bwFloat 4s ease-in-out infinite',
    },
    '.bw-shimmer': {
      background: 'linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.1) 50%, transparent 100%)',
      backgroundSize: '200% 100%',
      animation: 'bwShimmer 2s linear infinite',
    },
    '.bw-neon-border': {
      animation: 'bwNeonBorder 4s ease-in-out infinite',
    },
    '.bw-fade-in-up': {
      animation: 'bwFadeInUp 0.6s ease-out forwards',
    },

    // ** Card Glassmorphism
    '.bw-card': {
      background: 'rgba(13, 18, 36, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 229, 255, 0.1)',
      borderRadius: '16px',
      transition: 'all 0.3s ease',
      '&:hover': {
        border: '1px solid rgba(0, 229, 255, 0.25)',
        boxShadow: '0 8px 32px rgba(0, 229, 255, 0.1)',
        transform: 'translateY(-2px)',
      },
    },

    // ** Button Neon Effects
    '.bw-btn-primary': {
      background: 'linear-gradient(135deg, #00E5FF 0%, #00C2FF 100%)',
      color: '#050816',
      fontWeight: 700,
      letterSpacing: '0.5px',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
        transform: 'translateY(-1px)',
      },
    },
    '.bw-btn-secondary': {
      background: 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
      color: '#F8FAFC',
      fontWeight: 700,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
        transform: 'translateY(-1px)',
      },
    },

    // ** Demo spacing helpers
    '.demo-space-x > *': {
      marginTop: '1rem !important',
      marginRight: '1rem !important',
      'body[dir="rtl"] &': {
        marginRight: '0 !important',
        marginLeft: '1rem !important'
      }
    },
    '.demo-space-y > *:not(:last-of-type)': {
      marginBottom: '1rem'
    },
    '.MuiGrid-container.match-height .MuiCard-root': {
      height: '100%'
    },

    // ** Scrollbar for perfect-scrollbar
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: 'rgba(0, 229, 255, 0.05) !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor: 'rgba(0, 229, 255, 0.3) !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4
        },
        '&:hover, &:focus, &.ps--clicking': {
          backgroundColor: 'transparent !important',
          '& .ps__thumb-y': {
            width: 6
          }
        }
      }
    },

    // ** NProgress bar - BIGWHALE cyan
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        background: 'linear-gradient(90deg, #00E5FF, #A855F7, #FF2E9F)',
        boxShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
      }
    },

    // ** BIGWHALE Table Styles
    '.MuiDataGrid-root': {
      border: '1px solid rgba(0, 229, 255, 0.1) !important',
      borderRadius: '12px !important',
      background: 'rgba(13, 18, 36, 0.6)',
    },
    '.MuiDataGrid-columnHeaders': {
      background: 'rgba(0, 229, 255, 0.05) !important',
      borderBottom: '1px solid rgba(0, 229, 255, 0.15) !important',
    },
    '.MuiDataGrid-row:hover': {
      background: 'rgba(0, 229, 255, 0.04) !important',
    },

    // ** BIGWHALE Input Focus
    '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#00E5FF !important',
      boxShadow: '0 0 8px rgba(0, 229, 255, 0.2)',
    },

    // ** Wallet connection error image
    '.wallet-connection-error-img': {
      height: '160px !important',
      width: '160px !important',
    },

    // ** Nav header
    '.nav-header': {
      padding: 0,
      marginLeft: '-5px',
    },

    // ** Modal content
    '.modalContent': {
      margin: 'auto',
      padding: '20px',
      width: '400px',
    },

    // ** Rotate animation
    '.rotate': {
      animation: 'bwRotate 3s linear infinite',
    },
  }
}

export default GlobalStyles
