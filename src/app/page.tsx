import { ShowToast } from './show-toast'
import { GlobalToastRegion } from './toast'

export default function DemoPage() {
  return (
    <main className='p-24'>
      <h1 className='mb-4 text-2xl text-gray-600'>Test toast</h1>

      <ShowToast />

      <GlobalToastRegion />
    </main>
  )
}
