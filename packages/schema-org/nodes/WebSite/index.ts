import type { DeepPartial } from 'utility-types'
import type { Arrayable, MaybeIdReference, SchemaNodeInput, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  idReference,
  prefixId,
  resolveId,
  setIfEmpty,
} from '../../utils'
import type { Person } from '../Person'
import type { Organization } from '../Organization'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { SearchAction } from './asSearchAction'

export * from './asSearchAction'
/**
 * A WebSite is a set of related web pages and other items typically served from a single web domain and accessible via URLs.
 */
export interface WebSite extends Thing {
  '@type': 'WebSite'
  /**
   * The site's home URL (excluding a trailing slash).
   */
  url?: string
  /**
   * The name of the website.
   */
  name: string
  /**
   * A description of the website (e.g., the site's tagline).
   */
  description?: string
  /**
   * A reference-by-ID to the Organization which publishes the WebSite
   * (or an array of Organization and Person in the case that the website represents an individual).
   */
  publisher?: Arrayable<MaybeIdReference<Person | Organization>>
  /**
   * A SearchAction object describing the site's internal search.
   */
  potentialAction?: (SearchAction | unknown)[]
  /**
   * The language code for the WebSite; e.g., en-GB.
   * If the website is available in multiple languages, then output an array of inLanguage values.
   */
  inLanguage?: Arrayable<string>
}

export const WebSiteId = '#website'

export const defineWebSitePartial = <K>(input?: DeepPartial<WebSite> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineWebSite(input as WebSite)

export function defineWebSite<T extends SchemaNodeInput<WebSite>>(input: T) {
  return defineSchemaResolver<T, WebSite>(input, {
    defaults({ canonicalHost, options }) {
      return {
        '@type': 'WebSite',
        '@id': prefixId(canonicalHost, WebSiteId),
        'url': canonicalHost,
        'inLanguage': options.defaultLanguage,
      }
    },
    resolve(webSite, ctx) {
      resolveId(webSite, ctx.canonicalHost)
      // actions may be a function that need resolving
      webSite.potentialAction = webSite.potentialAction?.map(a => typeof a === 'function' ? a(ctx) : a)
      return webSite
    },
    rootNodeResolve(webSite, { findNode }) {
      const identity = findNode<Person | Organization>(IdentityId)
      if (identity)
        setIfEmpty(webSite, 'publisher', idReference(identity))

      return webSite
    },
  })
}

export const SchemaOrgWebSite = defineSchemaOrgComponent('SchemaOrgWebSite', defineWebSite)
