import { $RouteInterface } from "./dto"
import AuthLoginRoute from './routes/auth/login/login.routes'
import AuthSignupRoute from './routes/auth/signup/signup.routes'
import AuthTokenRoute from './routes/auth/token/token.routes'
import AuthPasswordRoute from './routes/auth/password/password.routes'
import UpdateRoute from './routes/auth/update/update.routes'
import DocsSwaggerRoute from './routes/docs/swagger.routes'
import FetchUserRoute from './routes/auth/fetch/fetchUser.routes'
import AuthExtraRoute from './routes/auth/update/update.routes'
import PlanRoute from './routes/plan/plan.routes'

export const RouteList:$RouteInterface[]=[
    {path: '/auth/login', module: AuthLoginRoute},
    {path: '/auth/signup', module: AuthSignupRoute},
    {path: '/auth/token', module: AuthTokenRoute},
    {path: '/auth/password', module: AuthPasswordRoute},
    {path: '/auth/update', module: UpdateRoute},
    {path: '/auth/fetch', module: FetchUserRoute},
    {path: '/swagger', module: DocsSwaggerRoute},
    {path: '/auth/extra', module: AuthExtraRoute},
    {path: '/plan', module: PlanRoute},
]