import type { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

let kanaalTeller = 0;

/**
 * Abonneer op alle wijzigingen (insert/update/delete) van een Postgres-tabel.
 *
 * Gebruikt bewust een unieke kanaalnaam per aanroep. De supabase-client is een
 * singleton die Fast Refresh en dubbele mounts overleeft, en `removeChannel()`
 * ruimt pas asynchroon op. Bij een vaste naam geeft `channel()` daardoor het
 * oude, al-gesubscribede kanaal terug en crasht `.on()` met
 * "cannot add postgres_changes callbacks after subscribe()". Een unieke naam
 * voorkomt dat hergebruik.
 *
 * Roep in de cleanup `supabase.removeChannel(channel)` aan met het teruggegeven
 * kanaal.
 */
export function subscribeToTable(
  table: string,
  onChange: () => void,
): RealtimeChannel {
  return supabase
    .channel(`${table}-realtime-${++kanaalTeller}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      onChange,
    )
    .subscribe();
}
