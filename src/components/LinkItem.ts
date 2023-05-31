const LinkItemPropsConfig = {
  data: {},
  link: {
    type: String,
    default: '#',
  },

  children: {
    type: Array,
    default: () => [],
  },
}
export { LinkItemPropsConfig }