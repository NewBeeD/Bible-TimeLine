import { useEffect, useState } from 'react'
import { Chip, Tooltip } from '@mui/material'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import { getPvpServerUrl, getPvpSocket } from '../modules/pvpSocket'

export const PvpConnectionBadge = ({ size = 'small' }) => {
  const socket = getPvpSocket()
  const [connected, setConnected] = useState(Boolean(socket.connected))

  useEffect(() => {
    const handleConnected = () => setConnected(true)
    const handleDisconnected = () => setConnected(false)

    socket.on('connect', handleConnected)
    socket.on('disconnect', handleDisconnected)
    socket.on('connect_error', handleDisconnected)

    return () => {
      socket.off('connect', handleConnected)
      socket.off('disconnect', handleDisconnected)
      socket.off('connect_error', handleDisconnected)
    }
  }, [socket])

  return (
    <Tooltip title={`PvP server: ${getPvpServerUrl()}`}>
      <Chip
        size={size}
        icon={<FiberManualRecordRoundedIcon sx={{ fontSize: 12, color: connected ? '#bbf7d0 !important' : '#f3f4f6 !important' }} />}
        label={connected ? 'Connected' : 'Disconnected'}
        color={connected ? 'success' : 'default'}
        variant={connected ? 'filled' : 'outlined'}
        sx={{
          color: connected ? 'white' : '#f3f4f6',
          borderColor: connected ? 'transparent' : 'rgba(243,244,246,0.6)',
          backgroundColor: connected ? undefined : 'rgba(255,255,255,0.08)'
        }}
      />
    </Tooltip>
  )
}
