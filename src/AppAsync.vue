<template>
  <div class="container">
    <div class="editor-container">
      <div>
        <select v-model="language" @change="setDefaultCode" class="language-select">
          <option v-for="(item, index) in compilers" :key="index" :value="index">{{ item }}</option>
        </select>
        <button @click="resetCode" :disabled="loading" class="reset-button">Reset Code</button>
      </div>
      <textarea v-model="code" class="editor" placeholder="Type your code here"></textarea>
      <button @click="runCode" :disabled="loading" class="run-button">Run Code</button>
    </div>
    <div class="input-container">
      <label class="input-label">Input:</label>
      <textarea v-model="input" class="input" placeholder="Type your input here"></textarea>
    </div>
    <div class="output-container">
      <label class="output-label">Output:</label>
      <pre :style="error ? 'color: red' : ''" class="output">{{ output }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "AsyncApp",
  data() {
    return {
      language: "jdk",
      sampleCode: {
        jdk: `class Solution  {
   public static void main(String[] args) {
       System.out.println("Hello World");
   }
}`,
        golang12: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`
      },
      bkSampleCode: {
        jdk: `class Solution  {
   public static void main(String[] args) {
       System.out.println("Hello World");
   }
}`,
        golang12: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`
      },
      code: '',
      input: "",
      output: "",
      loading: false,
      error: false,
      compilers: {

      }
    };
  },
  mounted() {
    this.loadCompilers()
  },
  methods: {
    loadCompilers() {
      this.loading = true
      axios.get("/api/v1/run/compilers").then(({ data }) => {
        this.compilers = data
        this.code = this.sampleCode[this.language]
      }).catch(e => {
        console.log({ e });
      })
          .finally(() => {
            this.loading = false
          })
    },
    async runCode() {
      // make a api call & then set output
      this.loading = true


      let respData = await axios.post("/api/v1/run/async", {
        compiler: this.language,
        code: this.code,
        input: this.input,
        timeout: 1500
      })

      const excId = respData.data

      // eslint-disable-next-line no-constant-condition
      while(true) {
        let response = await axios.get("/api/v1/run/async/status/" + excId)
        if(response.data === 'EXECUTED') break
        await this.sleep(1000)
      }

      let {data} = await axios.get("/api/v1/run/async/output/" + excId)

      this.output = data.output
      this.error = false
      if (!this.output) {
        this.output = data.error
        this.error = true;
      }

      this.loading = false
    },

    setDefaultCode(e) {
      this.code = this.sampleCode[e.target.value]
    },

    resetCode() {
      if (confirm("You will lose you current code, Do you want to proceed?"))
        this.code = this.bkSampleCode[this.language]
    },

    sleep(delay) {
      return new Promise((resolve) => setTimeout(resolve, delay))
    }

  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.editor-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.language-select {
  font-size: 16px;
  margin-bottom: 10px;
}

.editor {
  width: 100%;
  height: 200px;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  resize: none;
}

.run-button {
  /* margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer; */
}

.reset-button {}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.input-label {
  font-size: 18px;
  margin-bottom: 5px;
}

.input {
  width: 400px;
  height: 100px;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  resize: none;
}

.output-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.output-label {
  font-size: 18px;
  margin-bottom: 5px;
}

.output {
  width: 400px;
  max-height: 200px;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  overflow-y: auto;
  white-space: pre-wrap;
}
</style>