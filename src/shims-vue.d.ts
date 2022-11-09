declare module "*.vue" {
  import { defineComponent } from "vue"
  const Component: ReturnType<typeof defineComponent>
  export default Component
}
declare module "*.png" {
  const value: any
  export = value
}
declare module "*.svg" {
  const value: any
  export = value
}

declare module 'dom-to-image' {
  const value: any
  export = value
}