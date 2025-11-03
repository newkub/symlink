import * as p from "@clack/prompts"
import type { SymlinkType } from "./symlink"

export const intro = (message: string) => {
	console.clear()
	p.intro(message)
}

export const outro = (message: string) => {
	p.outro(message)
}

export const cancel = (message: string) => {
	p.cancel(message)
	process.exit(0)
}

export const selectAction = async () => {
	const action = await p.select({
		message: "What would you like to do?",
		options: [
			{ value: "create", label: "Create a new symlink" },
			{ value: "list", label: "List existing symlinks" },
			{ value: "remove", label: "Remove a symlink" },
		],
	})

	if (p.isCancel(action)) {
		cancel("Operation cancelled")
	}

	return action as "create" | "list" | "remove"
}

export const inputText = async (
	message: string,
	placeholder?: string,
	initialValue?: string,
): Promise<string> => {
	const result = await p.text({
		message,
		placeholder,
		initialValue,
		validate: (value) => {
			if (!value) return "Value is required"
		},
	})

	if (p.isCancel(result)) {
		cancel("Operation cancelled")
	}

	return result as string
}

export const selectSymlinkType = async (): Promise<SymlinkType> => {
	const type = await p.select({
		message: "Select symlink type:",
		options: [
			{ value: "dir", label: "Directory" },
			{ value: "file", label: "File" },
			{ value: "junction", label: "Junction (Windows)" },
		],
		initialValue: "dir",
	})

	if (p.isCancel(type)) {
		cancel("Operation cancelled")
	}

	return type as SymlinkType
}

export const confirm = async (
	message: string,
	initialValue = false,
): Promise<boolean> => {
	const result = await p.confirm({
		message,
		initialValue,
	})

	if (p.isCancel(result)) {
		cancel("Operation cancelled")
	}

	return result as boolean
}

export const spinner = () => p.spinner()

export const log = {
	success: (message: string) => p.log.success(message),
	error: (message: string) => p.log.error(message),
	info: (message: string) => p.log.info(message),
	warn: (message: string) => p.log.warn(message),
}
