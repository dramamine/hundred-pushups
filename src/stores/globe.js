

const state = {
  pushupCounter: 0
}

// just run the things
const dispatch = (action) => {
  action(state)
}

export default {
  state, dispatch
}
