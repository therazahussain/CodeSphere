import { configureStore } from '@reduxjs/toolkit'
import codeEditor from "./index.js"

export const store = configureStore({
  reducer: { codeEditor },
})