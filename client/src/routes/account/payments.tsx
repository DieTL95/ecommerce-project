import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/payments"!</div>
}
