type DestroyableObject = DestroyableObject & {
    destroy_timeout: NodeJS.Timeout
}

export default DestroyableObject