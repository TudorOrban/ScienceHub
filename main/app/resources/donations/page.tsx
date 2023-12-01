export default function DonationsPage() {
    return (
        <div className="px-8 py-4 bg-white space-y-4">
            <div className="flex justify-center font-semibold text-3xl py-4">
                Donations
            </div>
            <div className="text-lg">
                ScienceHub is an open-source, non-profit project that does not
                benefit from any funding at this point. To support all of the
                website&apos;s services, we need your help.
            </div>
            <div className="text-lg">
                You can donate to a common pool of funds. These funds will be
                fully used to allocate resources (compute time, storage,
                real-time etc.) that are distributed equally among the site&apos;s
                users
                <div className="flex items-center mt-4">
                    <button className="p-2 bg-green-700 text-white flex whitespace-nowrap border border-gray-200 rounded-md">
                        Donate to ScienceHub Community
                    </button>
                    <div className="flex flex-row p-2 m-2 space-x-4 bg-gray-100 whitespace-nowrap border border-gray-200 rounded-md">
                        <div>
                            <div>Funds: $134.25</div>
                            <div>Users: 245</div>
                        </div>
                        <div>
                            <div>
                                Compute Time per User: 4 Compute Unit Hour (CUH)
                            </div>
                            <div>Storage Space per User: 670MB</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-lg">
                You can also donate to ScienceHub&apos;s team. These funds will be
                used solely for the development of the site.
                <button className="p-2 mt-4 bg-green-700 text-white flex whitespace-nowrap border border-gray-200 rounded-md">
                    Donate to ScienceHub Team
                </button>
            </div>
        </div>
    );
}
