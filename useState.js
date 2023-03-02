let callIndex = -1
const states = []

const useState = (initialValue) => {
    const currentCallIndex = callIndex++

    states[currentCallIndex] = states[currentCallIndex]? states[currentCallIndex] : {
        value: initialValue,
        setValue: (newValue) => {
          states[currentCallIndex].value = newValue;
        }
    }

    return states[currentCallIndex]
}

module.exports = useState
