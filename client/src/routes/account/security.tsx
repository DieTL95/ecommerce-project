import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/security')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/security"!</div>
}
