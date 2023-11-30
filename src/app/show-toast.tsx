'use client'

import { toastQueue } from './toast'

export function ShowToast() {
  return (
    <button
      type='button'
      className='px-4 py-2 bg-sky-500 rounded text-white hover:bg-sky-600 transition-colors duration-75'
      onClick={() => toastQueue.add('Toast is done!')}
    >
      Show toast
    </button>
  )
}
