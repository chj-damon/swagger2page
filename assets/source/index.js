(() => {
  const vscode = acquireVsCodeApi()
  vscode.postMessage({ type: 'alert', text: '加油' })

  const state = vscode.getState()?.todos || []

  const listContainer = document.querySelector('#list')
  const addBtn = document.querySelector('#add')
  const input = document.querySelector('#input')

  state.forEach((node) => {
    listContainer.appendChild(createTodo(node.text, node.finish, node.id))
  })

  addBtn.addEventListener('click', addTodo)

  function addTodo() {
    if (input.value) {
      const li = createTodo(input.value)
      console.log(li)
      listContainer.appendChild(li)

      state.push({
        finish: false,
        text: input.value,
        id: li.id,
      })

      vscode.setState({ todos: state })
      input.value = ''
    }
  }

  function createTodo(text, finished, id) {
    const li = document.createElement('li')
    const btnCtn = document.createElement('div')
    const removeBtn = document.createElement('button')
    const finishBtn = document.createElement('button')
    const txt = document.createElement('span')

    txt.textContent = text
    removeBtn.textContent = '删除'
    removeBtn.addEventListener('click', () => removeTodo(li))

    if (!finished) {
      finishBtn.textContent = '完成'
      finishBtn.addEventListener('click', () => finishTodo(li))
    }
    else {
      li.className = 'finish'
    }
    btnCtn.appendChild(removeBtn)
    !finished && btnCtn.appendChild(finishBtn)

    li.appendChild(txt)
    li.appendChild(btnCtn)
    li.id = id || randomStr()

    return li
  }

  function removeTodo(node) {
    listContainer?.removeChild(node)
    const index = state.findIndex(n => n.id === node.id)
    if (index > -1) {
      state.splice(index, 1)
      console.log('====================================')
      console.log(state)
      console.log('====================================')
      vscode.setState({ todo: state })
    }
  }
  function finishTodo(node) {
    node.className = 'finish'
    const btnCtn = node.querySelector('div')
    btnCtn.removeChild(btnCtn.querySelectorAll('button')[1])
    vscode.postMessage({ type: 'finishMessage' })
    const index = state.findIndex(n => n.id === node.id)
    if (index > -1) {
      state[index].finish = true
      vscode.setState({ todo: state })
    }
  }

  function randomStr() {
    return Math.random().toString(36).slice(2)
  }
})()
