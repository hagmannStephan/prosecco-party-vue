import { useRouter } from 'vue-router'

export function usePushRouter() {
  const router = useRouter()

  function pushRouter(route: string) {
    router.push({ path: route })
  }

  return pushRouter;
}
