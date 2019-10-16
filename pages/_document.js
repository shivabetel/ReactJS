import Document, { Head, Main, NextScript } from 'next/document'
import Helmet from 'react-helmet'
import { React } from 'components/core/base-component'
import flush from 'styled-jsx/server'

// from https://github.com/zeit/next.js/edit/canary/examples/with-react-helmet/pages/_document.js
export default class extends Document {
  static async getInitialProps (ctx) {
    const documentProps = await super.getInitialProps(ctx)
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it

    /** Material UI SSR */
    let pageContext

    const page = ctx.renderPage(Component => {
      const WrappedComponent = props => {
        pageContext = props.pageContext
        return <Component {...props} />
      }
      return WrappedComponent
    })

    let css = ''
    // It might be undefined, e.g. after an error.
    if (pageContext) {
      css = pageContext.sheetsRegistry.toString()
    }
    /** Material UI SSR */

    return {
      ...page,
      ...pageContext,
      // Styles fragment is rendered after the app and page rendering finish.
      css,
      ...documentProps,
      helmet: Helmet.renderStatic() }
  }

  get helmetHtmlAttrComponents () {
    return this.props.helmet.htmlAttributes.toComponent()
  }

  get helmetBodyAttrComponents () {
    return this.props.helmet.bodyAttributes.toComponent()
  }

  get helmetHeadComponents () {
    return Object.keys(this.props.helmet)
      .filter(el => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map(el => this.props.helmet[el].toComponent())
  }

  get helmetJsx () {
    let title = 'hello jio-starter-kit'
    const { pageContext } = this.props
    return (
      <Helmet>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'
        />

        <meta
          name='theme-color'
          content={pageContext ? '#214796' : null}
        />

        {/* <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
        /> */}

        <link rel='manifest' href='/manifest.json' />

        <meta property='og:title' content={title} />

      </Helmet>
    )
  }

  render () {
    const { css } = this.props
    return (
      <html {...this.helmetHtmlAttrComponents} lang='en'>
        <Head>
          { this.helmetJsx }
          { this.helmetHeadComponents }
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          {/* <noscript>You need to enable JavaScript to run this app.</noscript> */}
          <Main />
          <React.Fragment>
            <style
              id='jss-server-side'
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
            {flush() || null}
          </React.Fragment>
          <NextScript />
        </body>
      </html>
    )
  }
}
