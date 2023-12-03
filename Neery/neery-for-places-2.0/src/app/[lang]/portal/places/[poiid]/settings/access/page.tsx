import { Access, accessRoles, getAccess, getAccessFromUser, roleAtLeast } from "@/lib/api/access";
import { getUser } from "@/lib/api/users";
import { ConfigFormStateless } from "../../components/Config/ConfigForm";
import { loadAndUseTranslation } from "@/app/[lang]/i18n";
import { LangProps } from "@/app/[lang]/props";
import { useAuth } from "@/lib/auth/server";
import { _CreateAccessModal, _CreateAccessModalButton, _DeleteAccessModal, _DeleteAccessModalButton, _EditAccessModalButton } from "./client";
import { redirect } from "next/navigation";
import { getPlace } from "@/lib/api/places";

export default async function PlaceSettingsAccess({
  params,
}: {
  params: { poiid: string },
} & LangProps) {
  const auth = await useAuth();

  const [{ t }, place, selfAcci] = await Promise.all([
    loadAndUseTranslation(params.lang, "portal/settings/access"),
    getPlace(params.poiid),
    getAccessFromUser(auth.user?.uuid ?? ""),
  ]);

  const self = selfAcci.find(x => x.poiid === place.poiid) as Access;

  if (!roleAtLeast(self.role, "MANAGER")) {
    return redirect(".");
  }

  const acci = await getAccess(params.poiid);
  const users = await Promise.all(acci.map(x => getUser(x.userId)));

  return (
    <_CreateAccessModal access={self}>
      <_DeleteAccessModal>
        <ConfigFormStateless
          title={t("title")}
        >
          <div className={`
            w-full xl:w-3/5
            flex flex-col
            gap-[8px]
            font-work
          `}>
            {acci.map(access => {
              const user = users.find(x => x.uuid === access.userId);

              if (user === undefined) {
                return null;
              }

              return (
                <div
                  key={access.userId}
                  className={`
                    flex justify-between
                    p-[16px] rounded-[16px]
                    border border-neutral-200
                  `}
                >
                  <div className="flex flex-col gap-[4px] justify-between">
                    <div className="flex gap-[8px] items-center">
                      {/* eslint-disable @next/next/no-img-element */}
                      {user.picture ? (
                        <img
                          className="w-[32px] h-[32px] object-cover rounded-full"
                          src={"data:image/jpeg;base64," + user.picture}
                          alt={user.name ?? "profile pic"}
                        />
                      ) : null}
                      {/* eslint-enable @next/next/no-img-element */}

                      <span className="font-medium">{user?.name ?? access.userId}</span>
                    </div>
                    <span>{t("accessRole." + access.role)}</span>
                  </div>

                  {accessRoles.indexOf(self.role) >= accessRoles.indexOf(access.role) ? (
                    <div className="flex flex-col justify-between gap-[8px]">
                      <_EditAccessModalButton
                        iconClass="w-[0.75rem] h-[0.75rem]"
                        poiid={params.poiid}
                        access={access}
                        user={user}
                      />

                      <_DeleteAccessModalButton
                        palette="red"
                        iconClass="w-[0.75rem] h-[0.75rem]"
                        poiid={params.poiid}
                        access={access}
                        user={user}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          
          <_CreateAccessModalButton
            size="medium"
            palette="secondary"
            className="w-full xl:w-3/5"
            poiid={params.poiid}
          >
            {t("newInvitation")}
          </_CreateAccessModalButton>
        </ConfigFormStateless>
      </_DeleteAccessModal>
    </_CreateAccessModal>
  );
}
