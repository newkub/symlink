#!/usr/bin/env node
import path from "node:path"
import * as ui from "./ui"
import * as symlink from "./symlink"

const resolvePath = (p: string) => path.resolve(process.cwd(), p)

const createSymlinkAction = async () => {
	const source = await ui.inputText(
		"Enter source path (absolute or relative):",
		"./source",
	)

	const target = await ui.inputText(
		"Enter target path (where symlink will be created):",
		"./target",
	)

	const type = await ui.selectSymlinkType()

	const spin = ui.spinner()
	spin.start("Creating symlink...")

	try {
		const sourcePath = resolvePath(source)
		const targetPath = resolvePath(target)

		const exists = await symlink.checkExists(sourcePath)
		if (!exists) {
			spin.stop("Failed")
			ui.log.error(`Source path does not exist: ${sourcePath}`)
			return
		}

		const targetExists = await symlink.checkExists(targetPath)
		if (targetExists) {
			spin.stop()
			const shouldReplace = await ui.confirm(
				`Target ${targetPath} already exists. Replace it?`,
				false,
			)

			if (!shouldReplace) {
				ui.log.info("Skipped")
				return
			}

			spin.start("Removing existing target...")
			await symlink.removeSymlink(targetPath)
			spin.stop("Removed")
			spin.start("Creating symlink...")
		}

		await symlink.createSymlink({
			source: sourcePath,
			target: targetPath,
			type,
		})

		spin.stop("Success")
		ui.log.success(`Created symlink: ${targetPath} -> ${sourcePath}`)
	} catch (error) {
		spin.stop("Failed")
		ui.log.error(`Failed to create symlink: ${error}`)
		throw error
	}
}

const listSymlinksAction = async () => {
	const dir = await ui.inputText(
		"Enter directory to scan for symlinks:",
		".",
		".",
	)

	const spin = ui.spinner()
	spin.start("Scanning for symlinks...")

	try {
		const dirPath = resolvePath(dir)
		const symlinks = await symlink.listSymlinks(dirPath)

		spin.stop(`Found ${symlinks.length} symlink(s)`)

		if (symlinks.length === 0) {
			ui.log.info("No symlinks found")
		} else {
			for (const link of symlinks) {
				ui.log.info(`${link.name} -> ${link.target}`)
			}
		}
	} catch (error) {
		spin.stop("Failed")
		ui.log.error(`Failed to scan directory: ${error}`)
		throw error
	}
}

const removeSymlinkAction = async () => {
	const target = await ui.inputText(
		"Enter symlink path to remove:",
		"./symlink",
	)

	const shouldRemove = await ui.confirm(
		"Are you sure you want to remove this symlink?",
		false,
	)

	if (!shouldRemove) {
		ui.log.info("Operation cancelled")
		return
	}

	const spin = ui.spinner()
	spin.start("Removing symlink...")

	try {
		const targetPath = resolvePath(target)

		const isSymlink = await symlink.checkIsSymlink(targetPath)
		if (!isSymlink) {
			spin.stop("Failed")
			ui.log.warn("The specified path is not a symlink. Aborting.")
			return
		}

		await symlink.removeSymlink(targetPath)
		spin.stop("Success")
		ui.log.success("Symlink removed successfully")
	} catch (error) {
		spin.stop("Failed")
		ui.log.error(`Failed to remove symlink: ${error}`)
		throw error
	}
}

const main = async () => {
	ui.intro("🔗 Symlink Creator")

	const action = await ui.selectAction()

	switch (action) {
		case "create":
			await createSymlinkAction()
			break
		case "list":
			await listSymlinksAction()
			break
		case "remove":
			await removeSymlinkAction()
			break
	}

	ui.outro("✨ Done!")
}

main().catch((error) => {
	ui.log.error(error)
	process.exit(1)
})
