/**
 * tests/unit/dbSsl.test.js
 *
 * Production must always keep SSL on (Render and Supabase present a chain Node
 * cannot verify). Local development must be able to turn it off, otherwise a
 * plain local Postgres fails with "server does not support SSL".
 */

const { resolveSslConfig, RELAXED_SSL } = require('../../src/config/dbSsl')

const LOCAL  = 'postgresql://user:pass@localhost:5432/app'
const REMOTE = 'postgresql://user:pass@db.abcdef.supabase.co:5432/postgres'

describe('resolveSslConfig', () => {
  describe('in production', () => {
    it('keeps relaxed SSL for a managed database', () => {
      expect(resolveSslConfig({ NODE_ENV: 'production', DATABASE_URL: REMOTE })).toEqual(RELAXED_SSL)
    })

    it('ignores DATABASE_SSL=disable', () => {
      const env = { NODE_ENV: 'production', DATABASE_URL: REMOTE, DATABASE_SSL: 'disable' }
      expect(resolveSslConfig(env)).toEqual(RELAXED_SSL)
    })

    it('ignores sslmode=disable in the connection string', () => {
      const env = { NODE_ENV: 'production', DATABASE_URL: `${REMOTE}?sslmode=disable` }
      expect(resolveSslConfig(env)).toEqual(RELAXED_SSL)
    })

    it('ignores a localhost host', () => {
      expect(resolveSslConfig({ NODE_ENV: 'production', DATABASE_URL: LOCAL })).toEqual(RELAXED_SSL)
    })
  })

  describe('outside production', () => {
    it('turns SSL off for localhost by default', () => {
      expect(resolveSslConfig({ NODE_ENV: 'development', DATABASE_URL: LOCAL })).toBe(false)
    })

    it.each(['127.0.0.1', '0.0.0.0', '[::1]'])('treats %s as local', (host) => {
      const env = { NODE_ENV: 'development', DATABASE_URL: `postgresql://u:p@${host}:5432/app` }
      expect(resolveSslConfig(env)).toBe(false)
    })

    it('keeps SSL on for a remote host by default', () => {
      expect(resolveSslConfig({ NODE_ENV: 'development', DATABASE_URL: REMOTE })).toEqual(RELAXED_SSL)
    })

    it.each(['disable', 'off', 'false', '0', 'NO'])('DATABASE_SSL=%s turns SSL off', (value) => {
      const env = { NODE_ENV: 'development', DATABASE_URL: REMOTE, DATABASE_SSL: value }
      expect(resolveSslConfig(env)).toBe(false)
    })

    it.each(['require', 'true', '1'])('DATABASE_SSL=%s turns SSL on', (value) => {
      const env = { NODE_ENV: 'development', DATABASE_URL: LOCAL, DATABASE_SSL: value }
      expect(resolveSslConfig(env)).toEqual(RELAXED_SSL)
    })

    it('reads sslmode=disable from the connection string', () => {
      const env = { NODE_ENV: 'development', DATABASE_URL: `${REMOTE}?sslmode=disable` }
      expect(resolveSslConfig(env)).toBe(false)
    })

    it('reads sslmode=require from the connection string', () => {
      const env = { NODE_ENV: 'development', DATABASE_URL: `${LOCAL}?sslmode=require` }
      expect(resolveSslConfig(env)).toEqual(RELAXED_SSL)
    })

    it('lets DATABASE_SSL win over sslmode', () => {
      const env = {
        NODE_ENV:     'development',
        DATABASE_URL: `${REMOTE}?sslmode=require`,
        DATABASE_SSL: 'disable',
      }
      expect(resolveSslConfig(env)).toBe(false)
    })

    it('keeps SSL on when DATABASE_URL is missing or unparseable', () => {
      expect(resolveSslConfig({ NODE_ENV: 'development' })).toEqual(RELAXED_SSL)
      expect(resolveSslConfig({ NODE_ENV: 'development', DATABASE_URL: 'not a url' })).toEqual(RELAXED_SSL)
    })
  })
})
