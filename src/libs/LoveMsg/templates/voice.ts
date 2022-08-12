
export const voiceTemplate = (mediaId: string) => {

    return {
        "msgtype": 'voice',
        "voice": {
            "media_id":mediaId,
        },
    }
}
