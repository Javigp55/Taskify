import React from 'react'

export const Footer = React.memo(() => {
  return (
<footer className="bg-gradient-to-b from-white to-lime-100 text-black w-full border-t-1 border-gray-200 p-10">
  <div className="container mx-auto text-center">
    <a href="..." className="hover:text-blue-200">Github</a>
    <p className="mt-2">© 2023 Tu App</p>
  </div>
</footer>
)
}
)