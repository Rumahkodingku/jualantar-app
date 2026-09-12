import { ServicePage } from "../components/service-page"
import { getServiceBySlug } from "../service-catalog"

const service = getServiceBySlug("jafood")

export default function JaFoodRoute() {
    return <ServicePage service={service} />
}
