import { styled } from '@slicknode/stylemapper'

const Heading = styled(
  'h1',
  'text-6xl font-extrabold leading-tight tracking-tighter text-orange-400 text-center',
  {
    variants: {
      size: {
        default: 'text-4xl md:text-5xl lg:text-6xl',
        sm: 'text-2xl md:text-3xl lg:text-4xl',
        lg: 'text-5xl md:text-6xl lg:text-7xl'
      }
    },
    defaultVariants: { size: 'default' }
  }
)

export default Heading
