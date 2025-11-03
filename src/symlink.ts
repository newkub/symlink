import { promises as fs } from "node:fs"
import path from "node:path"

export type SymlinkType = "file" | "dir" | "junction"

export interface SymlinkConfig {
	source: string
	target: string
	type?: SymlinkType
}

export interface SymlinkInfo {
	name: string
	path: string
	target: string
}

export const checkExists = async (filePath: string): Promise<boolean> => {
	try {
		await fs.access(filePath)
		return true
	} catch {
		return false
	}
}

export const checkIsSymlink = async (filePath: string): Promise<boolean> => {
	try {
		const stat = await fs.lstat(filePath)
		return stat.isSymbolicLink()
	} catch {
		return false
	}
}

export const createSymlink = async (config: SymlinkConfig): Promise<void> => {
	const { source, target, type = "dir" } = config
	await fs.symlink(source, target, type)
}

export const removeSymlink = async (filePath: string): Promise<void> => {
	await fs.unlink(filePath)
}

export const readSymlinkTarget = async (filePath: string): Promise<string> => {
	try {
		return await fs.readlink(filePath)
	} catch {
		return ""
	}
}

export const listSymlinks = async (dir: string): Promise<SymlinkInfo[]> => {
	const symlinks: SymlinkInfo[] = []

	try {
		const entries = await fs.readdir(dir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name)
			try {
				if (await checkIsSymlink(fullPath)) {
					const target = await readSymlinkTarget(fullPath)
					symlinks.push({
						name: entry.name,
						path: fullPath,
						target,
					})
				}
			} catch {
				// Skip errors
			}
		}
	} catch {
		// Return empty array if dir doesn't exist
	}

	return symlinks
}
